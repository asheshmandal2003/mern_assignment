import { router } from "./router";
import {
  createEmployee,
  getAllEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employees";
import {
  validateEmployee,
  validateUpdateEmployee,
} from "../validations/employees";
import { verifyAuthToken } from "../middlewares/check_authtoken";
import { upload } from "../utils/multer";

router
  .route("/")
  .get(verifyAuthToken, getAllEmployees)
  .post(
    upload.single("image"),
    verifyAuthToken,
    validateEmployee,
    createEmployee
  );
router
  .route("/:id")
  .get(verifyAuthToken, getEmployee)
  .put(
    upload.single("image"),
    verifyAuthToken,
    validateUpdateEmployee,
    updateEmployee
  )
  .delete(verifyAuthToken, deleteEmployee);

export default router;
