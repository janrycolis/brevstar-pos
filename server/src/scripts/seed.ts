import "reflect-metadata";
import bcrypt from "bcryptjs";
import { AppDataSource } from "../data-source.js";
import { Staff, StaffRole } from "../entities/Staff.js";

async function seed() {
  await AppDataSource.initialize();
  console.log("Database connected");

  const repo = AppDataSource.getRepository(Staff);
  const count = await repo.count();

  if (count > 0) {
    console.log(`Seed skipped — ${count} staff member(s) already exist`);
    await AppDataSource.destroy();
    return;
  }

  const passwordHash = await bcrypt.hash("admin123", 10);

  const admin = repo.create({
    firstName: "Admin",
    lastName: "User",
    email: "admin@brevstar.com",
    passwordHash,
    role: StaffRole.ADMIN,
    isActive: true,
  });

  await repo.save(admin);
  console.log("Default admin created: admin@brevstar.com / admin123");
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
