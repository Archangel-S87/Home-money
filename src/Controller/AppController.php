<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class AppController extends AbstractController {
	/**
	 * @Route("/api", name="app")
	 */
	public function index() {
		return $this->json([
			'app' => 'hello!'
		]);
	}
}
