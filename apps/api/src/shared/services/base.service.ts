import { prisma } from "../prisma";

/**
 * Base service class with common database operations
 */
export abstract class BaseService<T, CreateDTO, UpdateDTO> {
  protected abstract modelName: keyof typeof prisma;

  /**
   * Find a single record by ID
   */
  async findById(id: string): Promise<T | null> {
    const model = prisma[this.modelName] as unknown as {
      findUnique: (args: { where: { id: string } }) => Promise<T | null>;
    };
    return await model.findUnique({ where: { id } });
  }

  /**
   * Find multiple records with optional filtering
   */
  async findMany(options: {
    where?: unknown;
    orderBy?: unknown;
    take?: number;
    skip?: number;
    include?: unknown;
  }): Promise<T[]> {
    const model = prisma[this.modelName] as unknown as {
      findMany: (args: typeof options) => Promise<T[]>;
    };
    return await model.findMany(options);
  }

  /**
   * Create a new record
   */
  async create(data: CreateDTO): Promise<T> {
    const model = prisma[this.modelName] as unknown as {
      create: (args: { data: CreateDTO }) => Promise<T>;
    };
    return await model.create({ data });
  }

  /**
   * Update a record by ID
   */
  async update(id: string, data: UpdateDTO): Promise<T> {
    const model = prisma[this.modelName] as unknown as {
      update: (args: { where: { id: string }; data: UpdateDTO }) => Promise<T>;
    };
    return await model.update({ where: { id }, data });
  }

  /**
   * Delete a record by ID
   */
  async delete(id: string): Promise<T> {
    const model = prisma[this.modelName] as unknown as {
      delete: (args: { where: { id: string } }) => Promise<T>;
    };
    return await model.delete({ where: { id } });
  }

  /**
   * Count records with optional filtering
   */
  async count(options: { where?: unknown } = {}): Promise<number> {
    const model = prisma[this.modelName] as unknown as {
      count: (args: typeof options) => Promise<number>;
    };
    return await model.count(options);
  }

  /**
   * Check if a record exists
   */
  async exists(id: string): Promise<boolean> {
    const model = prisma[this.modelName] as unknown as {
      count: (args: { where: { id: string } }) => Promise<number>;
    };
    const count = await model.count({ where: { id } });
    return count > 0;
  }

  /**
   * Find first record matching criteria
   */
  async findFirst(options: {
    where?: unknown;
    orderBy?: unknown;
    include?: unknown;
  }): Promise<T | null> {
    const model = prisma[this.modelName] as unknown as {
      findFirst: (args: typeof options) => Promise<T | null>;
    };
    return await model.findFirst(options);
  }
}
