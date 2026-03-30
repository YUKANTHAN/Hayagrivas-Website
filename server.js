const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// Nodemailer Transporter Configuration
// Note: In a real application, use environment variables for credentials
// Using a mock or real SMTP if provided, for now setting up the structure
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com', // Replace with school email
        pass: 'your-app-password'     // Replace with app password
    }
});

// Gallery Upload Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Routes

// 1. Contact Form Submission
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, program, message } = req.body;

    try {
        // Load fee structure
        const feeStructure = JSON.parse(fs.readFileSync('./fee-structure.json', 'utf8'));
        const programDetails = feeStructure.programs[program] || feeStructure.programs.primary;

        // Mail to school admin
        const adminMailOptions = {
            from: 'your-email@gmail.com',
            to: 'admin@hayagrivascbse.com',
            subject: `New Enquiry from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nProgram: ${program}\nMessage: ${message}`
        };

        // Greeting notification to sender
        const userMailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Greetings from HAYAGRIVAS INTERNATIONAL SCHOOL',
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
                    <div style="background-color: #0F172A; padding: 30px; text-align: center;">
                        <h1 style="color: #D4AF37; margin: 0; font-family: serif;">HAYAGRIVAS</h1>
                        <p style="color: #ffffff; margin: 5px 0 0 0; letter-spacing: 2px; text-transform: uppercase; font-size: 12px;">International School</p>
                    </div>
                    <div style="padding: 40px; color: #333; line-height: 1.6;">
                        <h2 style="color: #0F172A;">Thank you for choosing us!</h2>
                        <p>Dear <strong>${name}</strong>,</p>
                        <p>We are delighted that you have expressed interest in <strong>HAYAGRIVAS INTERNATIONAL SCHOOL</strong> for your child's education. We have received your inquiry regarding our <strong>${programDetails.name}</strong> program.</p>
                        
                        <p>At HAYAGRIVAS, we are committed to providing a 100% English-speaking ambience and empowering students to become global leaders.</p>
                        
                        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #D4AF37;">
                            <h3 style="margin-top: 0; color: #0F172A;">Fee Structure - ${programDetails.name}</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px 0;"><strong>Annual Tuition Fee:</strong></td>
                                    <td style="text-align: right;">${programDetails.annualFee}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0;"><strong>One-time Admission Fee:</strong></td>
                                    <td style="text-align: right;">${programDetails.admissionFee}</td>
                                </tr>
                            </table>
                            <p style="margin-top: 15px; font-size: 14px; color: #64748b;">${programDetails.details}</p>
                        </div>

                        <p>If you have any urgent queries, please feel free to call us at <strong>73737 44882</strong>.</p>
                        
                        <br>
                        <p style="margin-bottom: 0;">Warm Regards,</p>
                        <p style="margin-top: 5px;"><strong>Admissions Department</strong><br>HAYAGRIVAS INTERNATIONAL SCHOOL, Sivakasi</p>
                    </div>
                    <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b;">
                        <p>&copy; 2026 HAYAGRIVAS INTERNATIONAL SCHOOL. All rights reserved.</p>
                        <p>Hayagrivas Gardens, Pernaickenpatti, Sivakasi 626189</p>
                    </div>
                </div>
            `
        };

        // SMS notification to customer
        // Note: To use SMS, you need to install twilio package: npm install twilio
        // Uncomment the following code and add your Twilio credentials
        /*
        const twilio = require('twilio');
        const twilioClient = twilio('YOUR_TWILIO_ACCOUNT_SID', 'YOUR_TWILIO_AUTH_TOKEN');
        
        const smsMessage = `Dear ${name},\n\nThank you for choosing HAYAGRIVAS INTERNATIONAL SCHOOL!\n\n${programDetails.name}\nAnnual Fee: ${programDetails.annualFee}\nAdmission Fee: ${programDetails.admissionFee}\n\n${programDetails.details}\n\nContact: 73737 44882\nEmail: admin@hayagrivascbse.com\n\nWe will contact you soon!\n\n- HAYAGRIVAS Team`;

        await twilioClient.messages.create({
            body: smsMessage,
            from: 'YOUR_TWILIO_PHONE_NUMBER',
            to: phone
        });
        */

        // Alternative: Using a local SMS gateway or API (example structure)
        // You can integrate with services like:
        // - Twilio (International)
        // - MSG91 (India)
        // - TextLocal (India)
        // - Fast2SMS (India)

        console.log('Attempting to send emails...', { to_admin: 'admin@hayagrivascbse.com', to_user: email });
        console.log('SMS would be sent to:', phone);
        console.log('Fee Details:', programDetails);

        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(userMailOptions);

        res.status(200).json({
            success: true,
            message: 'Message sent successfully!',
            feeDetails: programDetails
        });
    } catch (error) {
        console.error('Error sending mail:', error);
        res.status(500).json({ success: false, message: 'Failed to send message.' });
    }
});

// 2. Photo Upload to Gallery
app.post('/api/gallery/upload', upload.single('photo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const newPhoto = {
        url: `./uploads/${req.file.filename}`,
        filename: req.file.filename,
        originalName: req.file.originalname,
        uploadedAt: new Date()
    };

    // Store in gallery.json for persistence
    let galleryData = [];
    const galleryFilePath = './gallery.json';

    if (fs.existsSync(galleryFilePath)) {
        galleryData = JSON.parse(fs.readFileSync(galleryFilePath));
    }

    galleryData.push(newPhoto);
    fs.writeFileSync(galleryFilePath, JSON.stringify(galleryData, null, 2));

    res.status(200).json({ success: true, photo: newPhoto });
});

// 3. Get All Gallery Photos
app.get('/api/gallery', (req, res) => {
    const galleryFilePath = './gallery.json';
    if (fs.existsSync(galleryFilePath)) {
        const data = fs.readFileSync(galleryFilePath);
        res.json(JSON.parse(data));
    } else {
        res.json([]);
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
