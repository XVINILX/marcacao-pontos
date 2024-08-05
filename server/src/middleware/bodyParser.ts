// // src/middleware/bodyParser.ts
// import { IncomingMessage, ServerResponse } from "http";

// export const bodyParser = (
//   req: IncomingMessage,
//   res: ServerResponse,
//   next: () => void
// ): void => {
//   let body = "";

//   req.on("data", (chunk) => {
//     body += chunk.toString();
//   });

//   req.on("end", () => {
//     try {
//       req.body = JSON.parse(body);
//     } catch (error) {
//       res.statusCode = 400;
//       res.end(JSON.stringify({ message: "Invalid JSON" }));
//       return;
//     }
//     next();
//   });
// };
