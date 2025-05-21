***FRONTEND***

Before you can run this project, make sure you have the following installed:

-Node.js (v14 or higher) – You can download it from here

-npm (Node Package Manager) – This comes with Node.js.

-Angular CLI – If not installed globally, run:

   ***npm install -g @angular/cli***

   If you haven’t cloned the repository already, run the following command:
   
   ***git clone https://github.com/mevla94/crud-products-managment.git***
   
   ***cd crud-products-managment***
   
   Once inside the project directory, install the necessary dependencies by running:
   
   ***npm install***
   
   Once everything is set up, you can run the Angular development server using the following command:

   ***ng serve***

   ***BACKEND***
   Make sure you have the following installed:

- .NET 9 SDK – You can download it from here

- Visual Studio Code  – Recommended for development.

- SQL Server (or any other database) – The API requires a database to store product data.
  
  If you haven’t cloned the repository already, run:
  
  ***git clone https://github.com/mevla94/crud-products-managment.git***
  
  ***cd crud-products-managment/productApi***
  
  Once you're in the productApi folder, restore the project dependencies:

  ***dotnet restore***
  
  Open the appsettings.json file and configure your database connection string:
  
   "ConnectionStrings": {
    "DefaultConnection": "server=localhost;database=productsdatabase;user=root;password=Test123#;"
  }
  
  Replace localhost, your_username, and your_password with your actual database details.

  To run the API locally, use:

  ***dotnet run***
  Once the API is running, you can access the following endpoints (assuming a typical CRUD setup):

   GET /api/products – List all products.

   GET /api/products/{id} – Get a single product by ID.

   POST /api/products – Create a new product.

   PUT /api/products/{id} – Update an existing product.

   DELETE /api/products/{id} – Delete a product.

  ***Database Configuration***

  If you haven't created the database already, you can do so by running the following command after updating the connection string:

     ***dotnet ef database update***
  
  If you make changes to the data models, you'll need to create a migration and update the database:
  
     ***dotnet ef migrations add InitialCreate***
  
     ***dotnet ef database update***











  
 




