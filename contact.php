<?php
	if( !$_POST ) exit;
	
	//PHP Mailer
	use phpmailer\PHPMailer\PHPMailer;
	//use phpmailer\PHPMailer\SMTP;
	use phpmailer\PHPMailer\Exception;

    require_once( dirname( __FILE__ ) . "/assets/library/phpmailer/src/Exception.php");
	require_once( dirname( __FILE__ ) . "/assets/library/phpmailer/src/PHPMailer.php");
	require_once( dirname( __FILE__ ) . "/assets/library/phpmailer/src/SMTP.php");
	
	///////////////////////////////////////////////////////////////////////////

		//Enter name & email address that you want to emails to be sent to.
		
		$toName = "earthFund";
		$toAddress = "earthfundmedia@gmail.com";
		
	///////////////////////////////////////////////////////////////////////////
	
	//Only edit below this line if either instructed to do so by the author or have extensive PHP knowledge.
	
	//Form Fields
	$name = 	trim( $_POST[ "name" ] );
	$email = 	trim( $_POST[ "email" ] );
	$subject = 	trim( $_POST[ "subject" ] );
	$message = 	trim( $_POST[ "message" ] );
	
	//Check for empty fields
	if ( empty( $name ) or empty( $subject ) or empty( $message ) ) {
		echo json_encode( array( "status" => "error" ) );
	} else if ( empty( $email ) or !filter_var( $email, FILTER_VALIDATE_EMAIL ) ) {
		echo json_encode( array( "status" => "email") );
	} else {		
		//Send message via E-mail
		$body = "<p>You have been contacted by <b>" . $name . "</b>. The message is as follows.</p>
						<p>----------</p>
						<p>" . preg_replace( "/[\r\n]/i", "<br />", $message ) . "</p>
						<p>----------</p>
						<p>
							E-mail Address: <a href=\"mailto:" . $email . "\">" . $email . "</a>
						</p>";
		
		$objmail = new PHPMailer();
		
		//Use this line if you want to use PHP mail() function
		$objmail->isMail();
		
		//Use the codes below if you want to use SMTP mail
		/*			
		$objmail->isSMTP();
		$objmail->SMTPAuth = true;
		$objmail->Host = "mail.yourdomain.com";
		$objmail->Port = 587;	//You can remove that line if you don't need to set the SMTP port
		$objmail->Username = "example@yourdomain.com";
		$objmail->Password = "email_address_password";
		*/
		
		$objmail->setFrom( $email, $name );
		$objmail->addAddress( $toAddress, $toName );		
		$objmail->Subject = $subject;
		$objmail->msgHTML( $body );
		
		if( $objmail->send() ) {
			echo json_encode( array( "status" => "ok" ) );
		} else {
			echo json_encode( array( "status" => "error" ) );
		}
	}
?>