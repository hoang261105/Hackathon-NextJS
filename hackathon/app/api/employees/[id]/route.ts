import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";

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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const filePath = path.join(process.cwd(), "database/employees.json");
    const employees = JSON.parse(fs.readFileSync(filePath, "utf8"));

    const { id } = params;
    const updatedEmployee = await request.json();
    const employeeIndex = employees.findIndex(
      (employee: any) => employee.id == +id
    );

    if (employeeIndex !== -1) {
      employees[employeeIndex] = {
        ...employees[employeeIndex],
        ...updatedEmployee,
      }; // Merge the updates
      fs.writeFileSync(filePath, JSON.stringify(employees, null, 2));
      return NextResponse.json(employees[employeeIndex], { status: 200 });
    } else {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const filePath = path.join(process.cwd(), "database/employees.json");
    const employees = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Filter out the employee with the given id
    const filteredEmployees = employees.filter(
      (employee: any) => employee.id !== +params.id
    );

    // Write the updated employee list back to the file
    fs.writeFileSync(filePath, JSON.stringify(filteredEmployees, null, 2));

    return NextResponse.json(
      { message: "Employee deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
