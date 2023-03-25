const fs = require('fs');
const sendgrid = require('@sendgrid/mail');

// Load API key and set up SendGrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
sendgrid.setApiKey(SENDGRID_API_KEY);

// Load CSV file containing email addresses and filenames
const csvFilePath = 'list.csv';
const csvContent = fs.readFileSync(csvFilePath, 'utf8');

// Split CSV content into lines and parse each line into an object with email and filename properties
const lines = csvContent.trim().split('\n');
const emails = lines.map(line => {
  const [email, filename] = line.trim().split(',');
  return { email, filename };
});

// Send emails with attachments
emails.forEach(({ email, filename }) => {
  // Read file content from local storage
  let file= filename+".pdf"
  const filePath = `certs/${file}`;
  const fileContent = fs.readFileSync(filePath);
  console.log("File read successfully")

  // Create attachment object
  const attachment = {
    content: fileContent.toString('base64'),
    filename: filename,
    type: 'application/pdf', // Change to the correct MIME type for your file
    disposition: 'attachment',
  };

  // Send email using SendGrid API
  const msg = {
    to: email,
    bcc: ['kh_ledra@esi.dz'], 
    from: 'wtm.algiers@esi.dz',
    subject: "[IWD'23]: Thank you!",
    templateId: 'd-82af432cdde94775a7fab86af525d1cc',
    attachments: [attachment],
  };
  sendgrid.send(msg);
  console.log(email, 'SUCCESS')
});