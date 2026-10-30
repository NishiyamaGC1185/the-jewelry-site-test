"""
Uploads deploy/sakura/www/ (made by scripts/build-sakura.mjs) into the Sakura server's www
folder over FTP with TLS. Asks for the server password when run; it is kept in memory only.

    python scripts/upload-sakura.py              # everything that changed since the last upload
    python scripts/upload-sakura.py .htaccess    # only the files named
    python scripts/upload-sakura.py --clean      # delete server photos/videos the site no longer uses

A fingerprint of every uploaded file is kept in deploy/sakura/uploaded.json, so later runs
(or a run that was cut off) send only new or changed files. If the server drops the
connection, the script reconnects and retries. Server copies of instagram/posts.json and
instagram/config.php are never overwritten once they exist (the server owns them).
"""
import ftplib
import getpass
import hashlib
import json
import os
import sys
import time

HOST = "the-jewelry.sakura.ne.jp"
USER = "the-jewelry"
REMOTE = "www"
DEPLOY = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "deploy", "sakura")
LOCAL = os.path.join(DEPLOY, "www")
MANIFEST = os.path.join(DEPLOY, "uploaded.json")

# Files the server owns once it is running; uploaded only if missing there.
KEEP_ON_SERVER = {"instagram/posts.json", "instagram/config.php"}
# Folders --clean tidies: files there that are not in the package are removed from the server.
# (instagram/images is written by the server itself and is never touched.)
CLEAN_DIRS = ["images", "videos"]
RETRIES = 6


class Uploader:
    def __init__(self, password):
        self.password = password
        self.ftp = None
        self.dirs = set()

    def connect(self):
        if self.ftp:
            try:
                self.ftp.close()
            except Exception:
                pass
        self.ftp = ftplib.FTP_TLS(HOST, timeout=60)
        self.ftp.login(USER, self.password)
        self.ftp.prot_p()  # encrypt file transfers too
        self.ftp.voidcmd("TYPE I")

    def run(self, action):
        """Runs action(ftp); on a dropped connection waits, reconnects and tries again."""
        for attempt in range(1, RETRIES + 1):
            try:
                return action(self.ftp)
            except (OSError, EOFError, ftplib.error_temp) as e:
                if attempt == RETRIES:
                    raise
                print(f"      connection lost ({e.__class__.__name__}), reconnecting ({attempt}/{RETRIES - 1})...")
                time.sleep(3 * attempt)
                self.connect()

    def exists(self, path):
        def size(ftp):
            try:
                ftp.size(path)
                return True
            except ftplib.error_perm:
                return False
        return self.run(size)

    def mkdirs(self, folder):
        parts = folder.split("/")
        for i in range(1, len(parts) + 1):
            d = "/".join(parts[:i])
            if d in self.dirs:
                continue
            def mkd(ftp):
                try:
                    ftp.mkd(d)
                except ftplib.error_perm:
                    pass  # already there
            self.run(mkd)
            self.dirs.add(d)

    def upload(self, local, path):
        def stor(ftp):
            with open(local, "rb") as fh:
                ftp.storbinary(f"STOR {path}", fh)
        self.run(stor)


def fingerprint(path):
    with open(path, "rb") as fh:
        return hashlib.sha256(fh.read()).hexdigest()


def clean(done):
    """Lists server files in CLEAN_DIRS that the package no longer has, and deletes them after a yes."""
    up = Uploader(getpass.getpass(f"FTP password for {USER}@{HOST}: "))
    up.connect()
    print("Connected.")
    extra = []
    for d in CLEAN_DIRS:
        def listing(ftp):
            try:
                return [(n, f.get("type")) for n, f in ftp.mlsd(f"{REMOTE}/{d}")]
            except ftplib.error_perm:
                return []
        for name, kind in up.run(listing):
            if kind == "file" and not os.path.isfile(os.path.join(LOCAL, d, name)):
                extra.append(f"{d}/{name}")
    if not extra:
        print("Server is clean: no unused photos or videos.")
        up.ftp.quit()
        return
    for path in sorted(extra):
        print(f"unused  {path}")
    if input(f"\nDelete these {len(extra)} file(s) from the server? Type yes: ").strip().lower() != "yes":
        print("Nothing deleted.")
        up.ftp.quit()
        return
    for path in sorted(extra):
        up.run(lambda ftp: ftp.delete(f"{REMOTE}/{path}"))
        done.pop(path, None)
        print(f"del   {path}")
    with open(MANIFEST, "w", encoding="utf-8") as fh:
        json.dump(done, fh, indent=0)
    up.ftp.quit()
    print(f"\nDone: {len(extra)} unused file(s) removed from {HOST}/{REMOTE}.")


def main():
    if not os.path.isfile(os.path.join(LOCAL, "index.html")):
        sys.exit("deploy/sakura/www is missing: run  node scripts/build-sakura.mjs  first.")
    if sys.argv[1:] == ["--clean"]:
        done = {}
        if os.path.isfile(MANIFEST):
            with open(MANIFEST, encoding="utf-8") as fh:
                done = json.load(fh)
        clean(done)
        return
    only = {a.replace("\\", "/").lstrip("/") for a in sys.argv[1:]}
    done = {}
    if os.path.isfile(MANIFEST):
        with open(MANIFEST, encoding="utf-8") as fh:
            done = json.load(fh)

    todo = []
    for folder, _dirs, files in os.walk(LOCAL):
        rel = os.path.relpath(folder, LOCAL).replace("\\", "/")
        for name in files:
            path = name if rel == "." else f"{rel}/{name}"
            if only and path not in only:
                continue
            local = os.path.join(folder, name)
            fp = fingerprint(local)
            if not only and done.get(path) == fp:
                continue
            todo.append((path, local, fp))
    if only and len(todo) != len(only):
        sys.exit(f"Not in the package: {sorted(only - {p for p, _, _ in todo})}")
    if not todo:
        print("Nothing changed since the last upload.")
        return
    print(f"{len(todo)} file(s) to upload.")

    up = Uploader(getpass.getpass(f"FTP password for {USER}@{HOST}: "))
    up.connect()
    print("Connected.")
    for path, local, fp in todo:
        target = f"{REMOTE}/{path}"
        if "/" in path:
            up.mkdirs(target.rsplit("/", 1)[0])
        if path in KEEP_ON_SERVER and up.exists(target):
            print(f"keep  {path} (server copy)")
        else:
            up.upload(local, target)
            print(f"up    {path}")
        done[path] = fp
        with open(MANIFEST, "w", encoding="utf-8") as fh:
            json.dump(done, fh, indent=0)
    up.ftp.quit()
    print(f"\nDone: {len(todo)} file(s) on {HOST}/{REMOTE}.")


if __name__ == "__main__":
    main()
