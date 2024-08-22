import path from "path";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "database/employees.json");
    const data = fs.readFileSync(filePath, "utf8");
    const employee = JSON.parse(data);
    return NextResponse.json(employee);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const employeeRequest = await request.json();
    const filePath = path.join(process.cwd(), "database/employees.json");
    const data = fs.readFileSync(filePath, "utf8");
    const employee = JSON.parse(data);
    employee.push(employeeRequest);
    // B3: Ghi file
    fs.writeFileSync(filePath, JSON.stringify(employee), "utf8");
    return NextResponse.json({ message: "Thêm nhân viên thành công" });
  } catch (error) {
    return NextResponse.json(error);
  }
}
