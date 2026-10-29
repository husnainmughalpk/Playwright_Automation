
# Official Playwright 1.64.1 image
FROM mcr.microsoft.com/playwright:v1.64.1-noble

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Execute Playwright tests
CMD ["npx", "playwright", "test"]
