$BackendUrl = "http://localhost:8080"

# Test 1: Direct signup test
Write-Host "Testing signup endpoint..."
$signupBody = @{
    username = "2400032267"
    email = "2400032267@kluniversity.in"
    password = "Password123@"
    role = "STUDENT"
} | ConvertTo-Json

Write-Host "Request body: $signupBody`n"

try {
    $response = Invoke-WebRequest -Uri "$BackendUrl/api/auth/signup" `
        -Method POST `
        -ContentType "application/json" `
        -Body $signupBody `
        -UseBasicParsing -Verbose
    
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)`n"
}
catch [System.Net.WebException] {
    Write-Host "Error Status: $($_.Exception.Response.StatusCode)"
    Write-Host "Error: $($_.Exception.Response.StatusDescription)`n"
    
    try {
        $streamReader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        $body = $streamReader.ReadToEnd()
        $streamReader.Close()
        Write-Host "Response body: $body`n"
    }
    catch {
        Write-Host "Could not read error body`n"
    }
}

# Test 2: Login endpoint test
Write-Host "Testing login endpoint..."
$loginBody = @{
    identifier = "2400032267@kluniversity.in"
    password = "Password123@"
} | ConvertTo-Json

Write-Host "Request body: $loginBody`n"

try {
    $response = Invoke-WebRequest -Uri "$BackendUrl/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody `
        -UseBasicParsing
    
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)`n"
}
catch [System.Net.WebException] {
    Write-Host "Error Status: $($_.Exception.Response.StatusCode)"
    Write-Host "Error: $($_.Exception.Response.StatusDescription)`n"
}
