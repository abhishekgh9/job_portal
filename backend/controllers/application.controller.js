
import mongoose from "mongoose";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

// Centralized error handler for this controller
const handleControllerError = (res, error, defaultMessage = "Something went wrong") => {
  console.error(error);

  // If we've already sent a response, just exit
  if (res.headersSent) return;

  return res.status(500).json({
    message: defaultMessage,
    success: false,
  });
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized. User id is missing.",
        success: false,
      });
    }

    if (!jobId || !isValidObjectId(jobId)) {
      return res.status(400).json({
        message: "Valid job id is required.",
        success: false,
      });
    }

    // Check if the job exists and is still open
    const job = await Job.findById(jobId).select("_id applications position");
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    // Optional: capacity check (only if you want to enforce max applications based on position)
    // if (job.applications.length >= job.position) {
    //   return res.status(400).json({
    //     message: "This job is no longer accepting applications.",
    //     success: false,
    //   });
    // }

    // Check if the user has already applied for the job
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job.",
        success: false,
      });
    }

    // Create a new application
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const [newApplication] = await Application.create(
        [
          {
            job: jobId,
            applicant: userId,
          },
        ],
        { session }
      );

      job.applications.push(newApplication._id);
      await job.save({ session });

      await session.commitTransaction();

      return res.status(201).json({
        message: "Job applied successfully.",
        success: true,
        applicationId: newApplication._id,
      });
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  } catch (error) {
    return handleControllerError(res, error, "Failed to apply for job.");
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized. User id is missing.",
        success: false,
      });
    }

    // Optional basic pagination for scalability
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      Application.find({ applicant: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "job",
          options: { sort: { createdAt: -1 } },
          populate: {
            path: "company",
            options: { sort: { createdAt: -1 } },
          },
        }),
      Application.countDocuments({ applicant: userId }),
    ]);

    return res.status(200).json({
      application: applications,
      total,
      page,
      limit,
      hasMore: skip + applications.length < total,
      success: true,
    });
  } catch (error) {
    return handleControllerError(res, error, "Failed to fetch applied jobs.");
  }
};

// Admin: see all applicants for a given job
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!jobId || !isValidObjectId(jobId)) {
      return res.status(400).json({
        message: "Valid job id is required.",
        success: false,
      });
    }

    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    return res.status(200).json({
      job,
      applicantsCount: job.applications?.length || 0,
      success: true,
    });
  } catch (error) {
    return handleControllerError(res, error, "Failed to fetch applicants.");
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!applicationId || !isValidObjectId(applicationId)) {
      return res.status(400).json({
        message: "Valid application id is required.",
        success: false,
      });
    }

    if (!status) {
      return res.status(400).json({
        message: "Status is required.",
        success: false,
      });
    }

    const normalizedStatus = String(status).toLowerCase();
    const allowedStatuses = ["pending", "accepted", "rejected"];

    if (!allowedStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        message: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`,
        success: false,
      });
    }

    // Find and update the application in one go
    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status: normalizedStatus },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Status updated successfully.",
      success: true,
      application,
    });
  } catch (error) {
    return handleControllerError(res, error, "Failed to update application status.");
  }
};
