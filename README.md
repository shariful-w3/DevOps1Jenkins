# 🚀 GitHub Actions CI/CD Pipeline for Java Spring Maven Project

A simple and effective CI/CD pipeline using **GitHub Actions** for Java Spring applications built with Maven. This guide will help you set up an automated workflow that builds your project and deploys the JAR to a remote server using **SCP**.

🌐 **Project URL**: [http://103.7.4.166:8081/](http://103.7.4.166:8081/)

---

## 🧩 Steps to Set Up CI/CD

### Step 1: Create GitHub Repository
- Initialize your Java Spring Maven project repository on GitHub.
- Select the branch where you want to enable CI/CD.

---

### 🔐 Step 2: Add the Credentials

Go to your GitHub repository:

**Repository → Settings → Secrets and variables → Actions**

There, click **"New repository secret"** and add your credentials. For example:

- `SERVER_PASSWORD`
- `SERVER_USER`
- `SERVER_HOST`

You can then use them in your GitHub Actions workflow like this:

```yaml
sshpass -p "${{ secrets.SERVER_PASSWORD }}" scp -o StrictHostKeyChecking=no target/*.jar "${{ secrets.SERVER_USER }}"@"${{ secrets.SERVER_HOST }}":/root/OpsCICD/app.jar
```

### Step 3: Create GitHub Actions Workflow
- Go to the **Actions** tab in your repository.
- Use the predefined template: `Publish Java Package with Maven`, or
- Create your own workflow file manually.

📁 Example workflow:  
[View the GitHub Actions workflow file](https://github.com/shariful-w3/DevOps1/blob/main/.github/workflows/maven-publish.yml)

---

### Step 4: Copy CI/CD Script
- Copy the content from the provided `github-ci-cd.yml` file into your workflow directory:


## Some Useful Git Commands

<summary><strong>Generate a new SSH key</strong></summary>

```bash
ssh-keygen -t rsa -b 4096 -C "shariful.w3@gmail.com" -f ~/.ssh/id_rsa_account1
```

<summary><strong>git clone using ssh key</strong></summary>

```bash
git clone git@github.com-account1:shariful-w3/microservices-config.git
```

<summary><strong>check if a port is running</strong></summary>

```bash
sudo lsof -i :<PORT>
```

<summary><strong>Kill a running port</strong></summary>

```bash
sudo kill -9 $(lsof -t -i:8080)
```

## 🧩 Workflow Overview

The GitHub Actions workflow is defined in this file:
🔗 [`.github/workflows/maven-publish.yml`](https://github.com/shariful-w3/DevOps1/blob/main/.github/workflows/maven-publish.yml)

### ✅ Trigger

```yaml
on:
  push:
    branches:
      - main
```

> This triggers the workflow **every time code is pushed to the `main` branch**.

---

### 🔨 `build` Job

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
```

- **Checks out the code**
- **Sets up JDK 17**
- **Builds the project with Maven (`mvn clean package -DskipTests`)**

---

### 🚀 `deploy` Job

```yaml
  deploy:
    needs: build
    runs-on: ubuntu-latest
```

> Runs only **after the build job** completes successfully.

#### Key Steps:

1. **Setup JDK and Build Again**
   - Useful if artifacts are needed fresh.
   
2. **Install `sshpass`**
   - Enables non-interactive SSH login using password.

3. **Securely Copy JAR File**
   ```bash
   sshpass -p "${{ secrets.SERVER_PASSWORD }}" scp ...
   ```

4. **Kill Old Process on Port 8085**
   ```bash
   lsof -ti:8085 | xargs kill -9
   ```

5. **Start the New JAR Application**
   ```bash
   nohup java -jar ... > app.log &
   ```

---

# 🚀 Deployment & Monitoring Guide

## 📂 Application Log Location

All logs from the deployed application are stored at:

```
/root/OpsCICD/github/app.log
```

---

## 🔍 Some Useful `tail` Commands

### 1. **Live Log Monitoring**
Continuously stream the log file in real time:

```bash
tail -f /root/OpsCICD/github/app.log
```

---

### 2. **Read Last 1000 Lines**
Quickly check the latest 1000 lines of the log:

```bash
tail -n 1000 /root/OpsCICD/github/app.log
```

---

### 3. **Search Specific Text in Logs**
Search for specific log entries:

```bash
grep 'some search text' /root/OpsCICD/github/app.log
```

---

### 4. **Live Filtered Log (Real-Time Search)**
Monitor logs in real-time while filtering for multiple keywords (e.g., `user-authentication` or `USER_WEB_DEV`):

```bash
tail -f /root/OpsCICD/github/app.log | grep --line-buffered -E "user-authentication|USER_WEB_DEV"
```

---

## 📌 Tip

- Use `Ctrl+C` to stop any live monitoring (`tail -f`) session.
- You can modify the search terms as per your debugging needs.

---
