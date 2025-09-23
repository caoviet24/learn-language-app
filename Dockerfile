# Use the official .NET 8 SDK image as the base image for building
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# Copy csproj files and restore dependencies
COPY src/LearnLanguage.Domain/*.csproj ./src/LearnLanguage.Domain/
COPY src/LearnLanguage.Application/*.csproj ./src/LearnLanguage.Application/
COPY src/LearnLanguage.Infrastructure/*.csproj ./src/LearnLanguage.Infrastructure/
COPY src/LearnLanguage.API/*.csproj ./src/LearnLanguage.API/
COPY *.sln ./

# Restore dependencies
RUN dotnet restore

# Copy everything else and build
COPY . ./
RUN dotnet publish src/LearnLanguage.API/LearnLanguage.API.csproj -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy the published app from the build stage
COPY --from=build-env /app/out .

# Expose the port the app runs on
EXPOSE 8080
EXPOSE 8081

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Run the application
ENTRYPOINT ["dotnet", "LearnLanguage.API.dll"]