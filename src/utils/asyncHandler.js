const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      next(error)
    );
  };
};

// The function (fn) is passed on to other function
// const asyncHandler = (fn) => {
//   return async (req, res, next) => {
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

export { asyncHandler };
