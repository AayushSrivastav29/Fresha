const cron = require('node-cron');
const Appointment=require('../models/appointmentModel');
const User=require('../models/userModel');
const Staff=require('../models/staffModel');
const Service=require('../models/serviceModel');
const sendReminderEmail = require('../utils/sendEmail');

cron.schedule('0 9 * * *', async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split('T')[0];

    const appointments = await Appointment.findAll({
      where: { date: formattedDate, status: 'confirmed' },
      include: [
          {
          model: User
        },
        {
          model: Staff, 
          include: [{ model: User }] 
        },
        {
          model: Service
        }
      ]
    });
    const subject='Reminder: Your Salon Appointment is Tomorrow';
   
    for (const appt of appointments) {
         const userEmail = appt.User.email;
      const staffName = appt.Staff.User?.name || appt.Staff.name;
      const serviceName = appt.Service.name;
        const htmlContent=`
           <h2>Hello ${appt.User.name},</h2>
<p>This is a friendly reminder for your appointment:</p>
<ul>
  <li><strong>Service:</strong>${serviceName}</li>
  <li><strong>Staff:</strong>${staffName}</li>
  <li><strong>Date:</strong>${appt.date}</li>
  <li><strong>Time:</strong>${appt.startTime} - ${appt.endTime}</li>
</ul>
<p>Looking forward to seeing you!</p>
          `
      await sendReminderEmail(userEmail,subject,htmlContent);
    }

    console.log(`Reminders sent: ${appointments.length}`);
  } catch (err) {
    console.log('Cron job error:', err.message);
  }
});
