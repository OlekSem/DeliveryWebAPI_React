# ---------- Build ----------
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /source

COPY ["WebAPITransportation/WebAPITransportation.csproj", "WebAPITransportation/"]
RUN dotnet restore "WebAPITransportation/WebAPITransportation.csproj"

COPY . .
WORKDIR /source/WebAPITransportation
RUN dotnet publish -c Release -o /app

# ---------- Runtime ----------
FROM mcr.microsoft.com/dotnet/aspnet:9.0

WORKDIR /app
COPY --from=build /app .

ENV ASPNETCORE_URLS=http://0.0.0.0:5000
EXPOSE 5000

ENTRYPOINT ["dotnet", "WebAPITransportation.dll"]
