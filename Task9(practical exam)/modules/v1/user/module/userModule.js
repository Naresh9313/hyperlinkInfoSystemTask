import User from "../../../../database/models/userModel.js";
import statusCode from "../../../../config/statusCode.js";
import helper from "../../../../middleware/headerVerification.js";
import appointmentModel from "../../../../database/models/appointmentModel.js";
import { transporter } from "../../../../config/mailer.js";

const addFavouriteDoctor = async (userId, decryptedReq, res, req) => {
  try {
    const { doctorId } = decryptedReq;
    console.log(doctorId);

    if (!doctorId) {
      return helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, {
        keyword: "DOCTOR_ID_REQUIRED",
        components: [],
      });
    }
    console.log(userId);

    const user = await User.findById(userId);
    console.log(user);
    if (!user) {
      return helper.sendApiResponse(req, res, statusCode.NOT_FOUND, {
        keyword: "USER_NOT_FOUND",
        components: [],
      });
    }

    if (user.favourites.includes(doctorId)) {
      return helper.sendApiResponse(req, res, statusCode.BAD_REQUEST, {
        keyword: "ALREADY_FAVOURITE",
        components: [],
      });
    }

    user.favourites.push(doctorId);
    await user.save();

    return helper.sendApiResponse(req, res, statusCode.SUCCESS, {
      keyword: "DOCTOR_ADDED_TO_FAVOURITE",
      components: [],
    },user);
  } catch (error) {
    console.error("Module Add Favourite Error", error);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "SERVER_ERROR",
      components: [],
    });
  }
};



const bookAppointment = async (userId, appointmentData, res, req) => {
  try {
    const { doctorId, date, time } = appointmentData;

    if (!doctorId || !date || !time) {
      return helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, {
        keyword: "VALIDATION_ERROR",
        components: [],
      });
    }

    const [hours, minutes] = time.split(":").map(Number);
    const appointmentDateTime = new Date(date);
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    const now = new Date();
    if (appointmentDateTime < now) {
      return helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, {
        keyword: "INVALID_APPOINTMENT_DATE",
        message: "You cannot book an appointment for a past date/time.",
        components: [],
      });
    }

    const existingAppointment = await appointmentModel.findOne({
      user: userId,
      doctor: doctorId,
    });

    if (existingAppointment) {
      return helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, {
        keyword: "APPOINTMENT_ALREADY_EXISTS",
        message: "You already have an appointment booked with this doctor.",
        components: [],
      });
    }

    const appointment = new appointmentModel({
      user: userId,
      doctor: doctorId,
      date: appointmentDateTime,
      time,
    });

    await appointment.save();

    const user = await User.findById(userId);
    if (user && user.email) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Appointment Confirmation",
        text: `Hello ${user.fullName || "User"},\n\nYour appointment has been booked successfully.\n\nDoctor ID: ${doctorId}\nDate: ${appointmentDateTime.toLocaleDateString("en-IN")}\nTime: ${time}\n\nThank you.`,
      };

      await transporter.sendMail(mailOptions);
    }

    return helper.sendApiResponse(req, res, statusCode.SUCCESS, {
      keyword: "APPOINTMENT_BOOKED",
      components: [],
      appointment,
    });
  } catch (error) {
    console.error("Module Book Appointment Error:", error);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "SERVER_ERROR",
      components: [],
    });
  }
};

export default { addFavouriteDoctor, bookAppointment };
