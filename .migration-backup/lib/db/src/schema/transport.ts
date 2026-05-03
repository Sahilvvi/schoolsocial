import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const transportRoutesTable = pgTable("transport_routes", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull(),
  routeName: text("route_name").notNull(),
  vehicleNumber: text("vehicle_number"),
  driverName: text("driver_name"),
  driverPhone: text("driver_phone"),
  capacity: integer("capacity"),
  stops: text("stops"),
  morningTime: text("morning_time"),
  eveningTime: text("evening_time"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const transportStudentsTable = pgTable("transport_students", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull(),
  studentId: integer("student_id").notNull(),
  routeId: integer("route_id").notNull(),
  pickupStop: text("pickup_stop"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTransportRouteSchema = createInsertSchema(transportRoutesTable).omit({ id: true, createdAt: true });
export const insertTransportStudentSchema = createInsertSchema(transportStudentsTable).omit({ id: true, createdAt: true });
export type TransportRoute = typeof transportRoutesTable.$inferSelect;
