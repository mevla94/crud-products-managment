using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using productApi.Data;
using productApi.Models;
using System.ComponentModel.DataAnnotations;

var builder = WebApplication.CreateBuilder(args);

// Configure MySQL DbContext
builder.Services.AddDbContext<ProductDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 36))
    )
);

// Enable CORS for Angular app (localhost:4200)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDevClient", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Product API", Version = "v1" });
});

var app = builder.Build();

// Use CORS policy
app.UseCors("AllowAngularDevClient");

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler(errorApp =>
    {
        errorApp.Run(async context =>
        {
            context.Response.StatusCode = 500;
            await context.Response.WriteAsync("An unexpected error occurred.");
        });
    });
}

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Product API V1");
    c.RoutePrefix = string.Empty; 
});

 bool ValidateProduct(Product product, out List<string> errors)
{
    var context = new ValidationContext(product);
    var results = new List<ValidationResult>();
    var isValid = Validator.TryValidateObject(product, context, results, true);
    errors = results.Select(r => r.ErrorMessage ?? "").ToList();
    return isValid;
}

// GET all products
app.MapGet("/products", async (ProductDbContext db) =>
    await db.Products.ToListAsync());

// GET product by id
app.MapGet("/products/{id:int}", async (int id, ProductDbContext db) =>
{
    var product = await db.Products.FindAsync(id);
    return product is not null ? Results.Ok(product) : Results.NotFound();
});

// POST  product
app.MapPost("/products", async (Product product, ProductDbContext db) =>
{
    if (!ValidateProduct(product, out var errors))
        return Results.BadRequest(new { Errors = errors });

    db.Products.Add(product);
    await db.SaveChangesAsync();
    return Results.Created($"/products/{product.Id}", product);
});

// PUT  product 
app.MapPut("/products/{id:int}", async (int id, Product input, ProductDbContext db) =>
{
    if (!ValidateProduct(input, out var errors))
        return Results.BadRequest(new { Errors = errors });

    var product = await db.Products.FindAsync(id);
    if (product is null) return Results.NotFound();

    product.Name = input.Name;
    product.Description = input.Description;
    product.Price = input.Price;
    product.QuantityInStock = input.QuantityInStock;
    product.Category = input.Category;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

// DELETE product 
app.MapDelete("/products/{id:int}", async (int id, ProductDbContext db) =>
{
    var product = await db.Products.FindAsync(id);
    if (product is null) return Results.NotFound();

    db.Products.Remove(product);
    await db.SaveChangesAsync();
    return Results.NoContent();
});
//   Search by Name
app.MapGet("/products/search", async (string name, ProductDbContext db) =>
{
    var products = await db.Products
        .Where(p => p.Name.ToLower().Contains(name.ToLower()))
        .ToListAsync();

    return products.Any() ? Results.Ok(products) : Results.NotFound();
});


app.Run();
