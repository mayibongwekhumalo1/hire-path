import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth-utils";
import { z } from "zod";
import { UserRole } from "@/types";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.nativeEnum(UserRole).optional().default(UserRole.USER),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role } = registerSchema.parse(body);

    const db = await getDatabase();
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const now = new Date();
    const user = {
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: now,
      updatedAt: now
    };

    const result = await usersCollection.insertOne(user);
    const createdUser = { ...user, id: result.insertedId.toString() };

    // Remove password from response
    const { password: _, ...userResponse } = createdUser;

    return NextResponse.json({
      message: "User created successfully",
      user: userResponse
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}