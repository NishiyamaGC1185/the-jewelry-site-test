<?php
/**
 * THE JEWELRY contact form -- CONFIG
 * scripts/build-sakura.mjs writes the real address into the upload copy of this file
 * (from deploy/sakura/contact.json), so no address is stored in git.
 */

// Where enquiries are sent.
define('CONTACT_TO', 'PASTE_EMAIL_HERE');

// Sender shown on the email. Must be an address on this server's domain, or providers
// mark the mail as spam; the account's own mailbox exists on every Sakura server.
define('CONTACT_FROM', 'the-jewelry@the-jewelry.sakura.ne.jp');
define('CONTACT_FROM_NAME', 'THE JEWELRY Website');

// At most RATE_MAX messages per visitor within RATE_WINDOW seconds.
define('RATE_MAX', 5);
define('RATE_WINDOW', 600);

date_default_timezone_set('Asia/Tokyo');
