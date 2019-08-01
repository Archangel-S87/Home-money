<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use FOS\RestBundle\Controller\Annotations as Rest;

class UserController extends AbstractController {

	/**
	 * @Rest\Get("/users", name="users")
	 */
	public function index() {
		return $this->json([
			'message' => 'Welcome to your new controller!',
			'path' => 'src/Controller/UserController.php',
		]);
	}

}
