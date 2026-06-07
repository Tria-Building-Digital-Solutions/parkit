import { Request, Response } from "express";
import { NotificationsService } from "./notifications.service";
import { fail, ok } from "../../shared/utils/response";

import { NotificationTicketType } from "@prisma/client";

export class NotificationsController {
  static async listByUser(req: Request, res: Response) {
    try {
      const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
      const notifications = await NotificationsService.listByUser(userId);
      return ok(res, notifications);
    } catch (error: unknown) {
      return fail(
        res,
        400,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  static async unreadCount(req: Request, res: Response) {
    try {
      const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
      const count = await NotificationsService.getUnreadCount(userId);
      return ok(res, { count });
    } catch (error: unknown) {
      return fail(
        res,
        400,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  static async unreadCountByType(req: Request, res: Response) {
    try {
      const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
      const ticketType = Array.isArray(req.params.ticketType) ? req.params.ticketType[0] : req.params.ticketType;
      
      if (ticketType !== "PARKING" && ticketType !== "DELIVERY") {
        return fail(res, 400, "Invalid ticket type. Must be PARKING or DELIVERY");
      }
      
      const count = await NotificationsService.getUnreadCountByType(
        userId,
        ticketType as NotificationTicketType
      );
      return ok(res, { count });
    } catch (error: unknown) {
      return fail(
        res,
        400,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  static async unreadCountByAllTypes(req: Request, res: Response) {
    try {
      const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
      
      const [parkingCount, deliveryCount] = await Promise.all([
        NotificationsService.getUnreadCountByType(userId, NotificationTicketType.PARKING),
        NotificationsService.getUnreadCountByType(userId, NotificationTicketType.DELIVERY),
      ]);
      
      return ok(res, { parking: parkingCount, delivery: deliveryCount });
    } catch (error: unknown) {
      return fail(
        res,
        400,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  static async markAsRead(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const notification = await NotificationsService.markAsRead(
        id
      );

      return ok(res, notification);
    } catch (error: unknown) {
      return fail(
        res,
        400,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  static async markAllAsRead(req: Request, res: Response) {
    try {
      const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
      await NotificationsService.markAllAsRead(userId);

      return ok(res, null, "Notifications marked as read");
    } catch (error: unknown) {
      return fail(
        res,
        400,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await NotificationsService.delete(id);

      return ok(res, null, "Notification deleted");
    } catch (error: unknown) {
      return fail(
        res,
        400,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
}
