FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base

# Create non-root user for security
ARG APP_UID=1000
ARG APP_GID=1000
RUN addgroup --gid $APP_GID appgroup \
    && adduser --disabled-password --gecos "" --uid $APP_UID --gid $APP_GID appuser

WORKDIR /app
EXPOSE 9000
EXPOSE 8080

USER appuser

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Sadef.API/Sadef.API.csproj", "Sadef.API/"]
COPY ["Sadef.Application/Sadef.Application.csproj", "Sadef.Application/"]
COPY ["Sadef.Infrastructure/Sadef.Infrastructure.csproj", "Sadef.Infrastructure/"]
COPY ["Sadef.Domain/Sadef.Domain.csproj", "Sadef.Domain/"]
COPY ["Sadef.Common/Sadef.Common.csproj", "Sadef.Common/"]
RUN dotnet restore "Sadef.API/Sadef.API.csproj"
COPY . .
WORKDIR "/src/Sadef.API"
RUN dotnet build "Sadef.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Sadef.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Run as root to set permissions
USER root
RUN mkdir -p /app/uploads && chown -R appuser:appgroup /app/uploads

# Switch back to appuser
USER appuser

ENTRYPOINT ["dotnet", "Sadef.API.dll"]
