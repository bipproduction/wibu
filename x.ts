 import path from "path";
 // Skip authentication for public routes
 const isPublicRoute = ["/", "/api", "/user", "/login", "/register", "/dashboard/*"].some((route) => {
    const pattern = route.replace(/\*/g, ".*");
    return new RegExp(`^${pattern}$`).test("https://localhost:3000/api");
  });

  console.log(path.basename("https://localhost:3000/api/data/satu/dua/tiga"));