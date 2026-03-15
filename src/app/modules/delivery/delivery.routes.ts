import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLES } from "../../../enums/user";
import { DeliveryController } from "./delivery.controller";
import { DeliveryValidation } from "./delivery.validation";
import fileUploadHandler from "../../middlewares/fileUploaderHandler";
import parseAllFilesData from "../../middlewares/parseAllFileData";
import { normalizeDeliveryBody } from "../../middlewares/deliveryFileHandaler";

const router = express.Router();

const requireCustomer = auth(USER_ROLES.CUSTOMER);
const requireDriver = auth(USER_ROLES.DRIVER);

// customer
router.post(
  "/",
  requireCustomer,
  fileUploadHandler(),
  parseAllFilesData({ fieldName: "parcelPhotos", forceMultiple: true }),
  normalizeDeliveryBody,
  validateRequest(DeliveryValidation.createDelivery),
  DeliveryController.create,
);

router.get("/my", requireCustomer, DeliveryController.myDeliveries);

router.patch(
  "/:id/change-offer",
  requireCustomer,
  validateRequest(DeliveryValidation.changeOffer),
  DeliveryController.changeOffer,
);

router.patch(
  "/:id/change-info",
  requireCustomer,
  fileUploadHandler(),
  parseAllFilesData({ fieldName: "parcelPhotos", forceMultiple: true }),
  normalizeDeliveryBody,
  validateRequest(DeliveryValidation.changeDeliveryInfo),
  DeliveryController.changeDeliveryInfo,
);

router.patch(
  "/:id/cancel",
  requireCustomer,
  validateRequest(DeliveryValidation.cancelDelivery),
  DeliveryController.cancelDelivery,
);

router.get(
  "/:id/matches",
  requireCustomer,
  validateRequest(DeliveryValidation.matches),
  DeliveryController.matches,
);

router.get(
  "/:id/finding-couriers",
  requireCustomer,
  validateRequest(DeliveryValidation.findingCouriers),
  DeliveryController.findingCouriers,
);

router.post(
  "/:id/select-driver",
  requireCustomer,
  validateRequest(DeliveryValidation.selectDriver),
  DeliveryController.selectDriver,
);

// driver
router.get("/driver/home", requireDriver, DeliveryController.driverHome);
router.get("/driver/my", requireDriver, DeliveryController.driverMyDeliveries);

router.post(
  "/:id/accept-open",
  requireDriver,
  validateRequest(DeliveryValidation.driverAcceptOpen),
  DeliveryController.driverAcceptOpen,
);

router.post(
  "/driver/bid",
  requireDriver,
  validateRequest(DeliveryValidation.driverBid),
  DeliveryController.driverBid,
);

router.post(
  "/:id/start-journey",
  requireDriver,
  DeliveryController.startJourney,
);

router.post(
  "/:id/arrived-pickup",
  requireDriver,
  DeliveryController.arrivedPickup,
);

router.post(
  "/:id/arrived-dropoff",
  requireDriver,
  DeliveryController.arrivedDropoff,
);

router.post(
  "/:id/driver-delivered",
  requireDriver,
  DeliveryController.driverDelivered,
);

router.post(
  "/:id/confirm-delivered",
  requireCustomer,
  DeliveryController.customerConfirm,
);

router.post(
  "/:id/rate",
  auth(USER_ROLES.CUSTOMER, USER_ROLES.DRIVER),
  validateRequest(DeliveryValidation.rateDelivery),
  DeliveryController.rateDelivery,
);

router.patch(
  "/:id/driver-cancel",
  requireDriver,
  DeliveryController.driverCancelDelivery,
);

export const DeliveryRoutes = router;

 