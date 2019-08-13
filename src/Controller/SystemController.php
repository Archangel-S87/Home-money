<?php

namespace App\Controller;

use App\Entity\User;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use FOS\RestBundle\Controller\Annotations as Rest;
use Symfony\Component\HttpFoundation\Response;

class SystemController extends AbstractController
{

    /**
     * @Rest\Get("/system/bill/{id}", name="getBill")
     * @param User $user
     * @return Response
     */
    public function getBill(User $user)
    {
        $this->denyAccessUnlessGranted('view', $user);

        return $this->json([
            'errors' => false,
            'data' => [
                'bill' => $user->getBill(),
                'currency' => $user->getCurrency()
            ]
        ]);
    }

    public function isAuthor(User $user = null)
    {
        return $user && $user->getEmail() == '123';
    }

}
