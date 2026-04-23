# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source

# Copy csproj from subdirectory and restore
COPY ["vovyan_2123110357/vovyan_2123110357.csproj", "vovyan_2123110357/"]
RUN dotnet restore "vovyan_2123110357/vovyan_2123110357.csproj"

# Copy everything
COPY . .
WORKDIR "/source/vovyan_2123110357"
RUN dotnet publish -c Release -o /app

# Final Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .

# Expose port 8080
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "vovyan_2123110357.dll"]
