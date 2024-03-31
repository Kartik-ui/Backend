const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      next(error)
    );
  };
};

export { asyncHandler };

// The function (fn) is passed on to other function
// const asyncHandler = (fn) => {
//   async (req, res, next) => {
//     try {
//       await fn(req, res, next);
//     } catch (error) {
//       res.status(error.statusCode || 500).json({
//         success: false,
//         message: error.message || "Internal server error",
//       });
//     }
//   };
// };
