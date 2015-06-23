
<?php

if(isset($_POST['email'])) {
	$email_to = "contact@nerdybirdygame.com";
	//validate inputs
	if(!isset($_POST['name']) ||
		!isset($_POST['email']) ||
		!isset($_POST['message'])) {
			$errormsg .= " You haven't filled out all the required fields!";
		}
	$name = $_POST['name'];
	$email = $_POST['email'];
	$msg = $_POST['message'];

	
	$errormsg = "";
	$data = array();
	$errors = array();
	$email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';
	if(!preg_match($email_exp,$email)) {
		$errormsg .= " You've entered an invalid email address.";
	}
	
	$string_exp = "/^[A-Za-z .'-]+$/";
	if(!preg_match($string_exp,$name)) {
		$errormsg .= " The name you entered seems to be invalid.";
	}
	
	
	$email_message = "Contact Form Message: \n\n";
	$email_message .= "Name: ".$name."\n\n";
	$email_message .= "\nEmail: ".$email."\n\n";
	$email_message .= "\nMessage: ".$msg."\n\n";
	
	//email headers
	$from = "From: $name \r\n";
	$from .= "Reply-to: $email \r\n";

	$subject = "NerdyBirdyGame.com Message";

	if (!empty($errormsg)) {
		$data['success'] = false;
		$data['message'] = $errormsg;
		echo json_encode($data);
		die();
	}
	
    if (mail ($email_to, $subject, $email_message, $from)) { 
		 $data['success'] = true;
		 $data['message'] = "Your message has been sent!";
    } else { 
		 $data['success'] = false;
		 $data['message'] = "Oh no - a form malfunction! Try email: contact@nerdybirdygame.com";
    }
}

	echo json_encode($data);	
?>