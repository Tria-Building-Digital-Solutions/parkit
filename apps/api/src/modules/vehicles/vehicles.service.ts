import { prisma } from "../../shared/prisma";
import type { Prisma } from "@prisma/client";
import { formatPlate } from "../../shared/utils/plate";

interface CreateVehicleDTO {
  plate: string;
  brand: string;
  model: string;
  color?: string;
  year?: number;
  countryCode?: string;
  dimensions?: Prisma.InputJsonValue;
}

interface UpdateVehicleDTO {
  plate?: string;
  countryCode?: string;
  brand?: string;
  model?: string;
  color?: string;
  year?: number;
  dimensions?: Prisma.InputJsonValue;
}

export class VehiclesService {
  static async create(companyId: string, data: CreateVehicleDTO) {
    const existingVehicle = await prisma.vehicle.findUnique({
      where: {
        plate_countryCode: {
          plate: data.plate,
          countryCode: data.countryCode || "CR",
        },
      },
    });

    if (existingVehicle) {
      throw new Error("Vehicle with this plate already exists");
    }

    return prisma.vehicle.create({
      data: {
        companyId,
        plate: data.plate,
        brand: data.brand,
        model: data.model,
        ...(data.color !== undefined ? { color: data.color } : {}),
        year: data.year,
        countryCode: data.countryCode || "CR",
        ...(data.dimensions ? { dimensions: data.dimensions } : {}),
      },
    });
  }

  static async list(companyId: string) {
    return prisma.vehicle.findMany({
      where: { companyId },
      include: {
        owners: {
          include: {
            customer: {
              select: {
                id: true,
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getById(companyId: string, vehicleId: string) {
    return prisma.vehicle.findFirst({
      where: { id: vehicleId, companyId },
      include: {
        owners: {
          include: {
            customer: {
              select: {
                id: true,
                userId: true,
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        tickets: {
          select: {
            id: true,
            status: true,
            entryTime: true,
            exitTime: true,
          },
          orderBy: { entryTime: "desc" },
          take: 10,
        },
      },
    });
  }

  static async update(
    companyId: string,
    vehicleId: string,
    data: UpdateVehicleDTO
  ) {
    const current = await prisma.vehicle.findFirst({
      where: { id: vehicleId, companyId },
      select: { countryCode: true },
    });
    if (!current) return null;

    if (data.plate != null && data.plate.trim() !== "") {
      const countryCodeToCheck =
        data.countryCode !== undefined ? data.countryCode.trim() || "CR" : current.countryCode;
      const existing = await prisma.vehicle.findFirst({
        where: {
          plate: data.plate.trim(),
          countryCode: countryCodeToCheck,
          id: { not: vehicleId },
        },
      });
      if (existing) throw new Error("Vehicle with this plate already exists");
    }
    return prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        ...(data.plate != null && data.plate.trim() !== "" && { plate: data.plate.trim() }),
        ...(data.countryCode !== undefined && { countryCode: data.countryCode.trim() || "CR" }),
        ...(data.brand !== undefined && { brand: data.brand }),
        ...(data.model !== undefined && { model: data.model }),
        ...(data.color !== undefined && { color: data.color }),
        ...(data.year !== undefined && { year: data.year }),
        ...(data.dimensions !== undefined ? { dimensions: data.dimensions } : {}),
      },
      include: {
        owners: {
          include: {
            customer: true,
          },
        },
      },
    });
  }

  static async delete(companyId: string, vehicleId: string) {
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: vehicleId, companyId },
    });
    if (!vehicle) return null;
    const [ticketCount, bookingCount] = await Promise.all([
      prisma.ticket.count({ where: { vehicleId } }),
      prisma.booking.count({ where: { vehicleId } }),
    ]);
    if (ticketCount > 0 || bookingCount > 0) {
      throw new Error("No se puede eliminar un vehículo con tickets o reservas asociados.");
    }
    await prisma.vehicle.delete({ where: { id: vehicleId } });
    return vehicle;
  }

  static async getByPlate(
    companyId: string,
    plate: string,
    countryCode: string = "CR"
  ) {
    return prisma.vehicle.findFirst({
      where: {
        plate,
        countryCode,
        companyId,
      },
      select: {
        id: true,
        plate: true,
        brand: true,
        model: true,
        color: true,
        year: true,
        countryCode: true,
        companyId: true,
        createdAt: true,
        updatedAt: true,
        dimensions: true,
        owners: {
          include: {
            customer: {
              select: {
                id: true,
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  /** Global search by plate+country (unique in DB). Valets rotate between companies. */
  static async getByPlateGlobal(plate: string, countryCode: string = "CR") {
    // Try exact match first
    let vehicle = await prisma.vehicle.findUnique({
      where: {
        plate_countryCode: {
          plate,
          countryCode: countryCode || "CR",
        },
      },
      select: {
        id: true,
        plate: true,
        brand: true,
        model: true,
        color: true,
        year: true,
        countryCode: true,
        companyId: true,
        createdAt: true,
        updatedAt: true,
        dimensions: true,
        owners: {
          include: {
            customer: {
              select: {
                id: true,
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    // If not found, try without dash (in case DB has no dash but search has dash)
    if (!vehicle) {
      const plateWithoutDash = plate.replace(/-/g, "");
      vehicle = await prisma.vehicle.findUnique({
        where: {
          plate_countryCode: {
            plate: plateWithoutDash,
            countryCode: countryCode || "CR",
          },
        },
        include: {
          owners: {
            include: {
              customer: {
                select: {
                  id: true,
                  user: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                      email: true,
                      phone: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    }

    // If still not found, try with dash (in case DB has dash but search has no dash)
    if (!vehicle && !plate.includes("-")) {
      const plateWithDash = formatPlate(plate);
      vehicle = await prisma.vehicle.findUnique({
        where: {
          plate_countryCode: {
            plate: plateWithDash,
            countryCode: countryCode || "CR",
          },
        },
        include: {
          owners: {
            include: {
              customer: {
                select: {
                  id: true,
                  user: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                      email: true,
                      phone: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    }

    // Also try to list all vehicles for debugging
    if (!vehicle) {
      const _allVehicles = await prisma.vehicle.findMany({
        where: { countryCode: countryCode || "CR" },
        select: { plate: true, id: true },
        take: 10,
      });
    }

    return vehicle;
  }
}
