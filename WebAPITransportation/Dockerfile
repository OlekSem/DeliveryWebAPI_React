# ---------- Build ----------
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /source

# Copy solution
COPY WebAPITransportation.sln ./

# Copy ALL project files (but not source code yet)
COPY Core/*.csproj Core/
COPY Domain/*.csproj Domain/
COPY WebAPITransportation/*.csproj WebAPITransportation/

# Restore dependencies
RUN dotnet restore WebAPITransportation.sln

# Copy the rest of the source
COPY . .

# Publish
WORKDIR /source/WebAPITransportation
RUN dotnet publish -c Release -o /app

# ---------- Runtime ----------
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

COPY --from=build /app .

ENV ASPNETCORE_URLS=http://0.0.0.0:5000
EXPOSE 5000

ENTRYPOINT ["dotnet", "WebAPITransportation.dll"]