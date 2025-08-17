<?php
/**
 * Contact Form Handler for David Dyakov - Classical Guitarist Website
 * 
 * This is an optional backend script for self-hosting the contact form.
 * Alternative to using Formspree.
 * 
 * Requirements:
 * - PHP with mail() function enabled
 * - Update the $to_email variable with your email address
 */

// Enable CORS for your domain (update with your actual domain)
header("Access-Control-Allow-Origin: https://your-domain.com");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Configuration
$to_email = "david.dyakov@capricciodiabolico.com"; // Change to your email
$subject_prefix = "[Website Contact] ";

// Only process POST requests
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

// Get form data
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$location = isset($_POST['location']) ? trim($_POST['location']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';
$subscribe = isset($_POST['subscribe']) ? $_POST['subscribe'] : '';

// Validate required fields
if (empty($email)) {
    http_response_code(400);
    echo json_encode(["error" => "Email is required"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid email format"]);
    exit;
}

if (empty($name) && empty($message)) {
    http_response_code(400);
    echo json_encode(["error" => "Please provide your name or a message"]);
    exit;
}

// Build email content
$email_subject = $subject_prefix;
if (!empty($name)) {
    $email_subject .= "Message from " . $name;
} else {
    $email_subject .= "Website Contact Form";
}

$email_body = "New contact form submission:\n\n";
$email_body .= "From: " . ($name ?: 'Not provided') . "\n";
$email_body .= "Email: " . $email . "\n";
$email_body .= "Location: " . ($location ?: 'Not provided') . "\n";
$email_body .= "Newsletter: " . ($subscribe === 'yes' ? 'Yes' : 'No') . "\n\n";
$email_body .= "Message:\n" . ($message ?: 'No message provided') . "\n\n";
$email_body .= "---\n";
$email_body .= "Sent from: " . $_SERVER['HTTP_HOST'] . "\n";
$email_body .= "Time: " . date('Y-m-d H:i:s') . "\n";
$email_body .= "IP: " . $_SERVER['REMOTE_ADDR'] . "\n";

// Email headers
$headers = "From: " . $email . "\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send email
if (mail($to_email, $email_subject, $email_body, $headers)) {
    // If newsletter subscription is requested, you could add them to a mailing list here
    if ($subscribe === 'yes') {
        // Add your newsletter subscription logic here
        // e.g., add to Mailchimp, ConvertKit, etc.
    }
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Thank you for your message! I'll get back to you soon."
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "error" => "Failed to send message. Please try again later."
    ]);
}
?>
