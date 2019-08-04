<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use FOS\RestBundle\Controller\Annotations as Rest;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class AuthController extends AbstractController
{

    // Список валют личного счёта
    const CURRENCY = ['RUB', 'BYN', 'USD'];

    /**
     * @Rest\Get("/login", name="login")
     */
    public function login(Request $request, UserRepository $repository, UserPasswordEncoderInterface $passwordEncoder)
    {

        $email = $request->get('email');
        $pass = $request->get('password');

        if (!$email || !$pass) return $this->json(false);;



        $user = [
            'id' => 1,
            'email' => 'wfm@mail.ru',
            'password' => '12345678',
            'name' => 'Администратор'
        ];

        return $this->json(false);
    }

    /**
     * @Rest\Get("/is-email", name="isEmail")
     */
    public function isEmail(Request $request, UserRepository $repository)
    {

        $email = $request->get('email');

        $response = [
            'errors' => false,
            'is_email' => $repository->findBy(['email' => $email]) ? true : false
        ];

        return $this->json($response);

    }

    /**
     * @Rest\Get("/registration", name="registration")
     */
    public function registration(Request $request, ValidatorInterface $validator, UserPasswordEncoderInterface $passwordEncoder)
    {

        $user = new User();
        $user
            ->setEmail($request->get('email'))
            ->setPassword($request->get('password'))
            ->setName($request->get('name'))
            ->setCurrency($request->get('currency'));

        $errors = $validator->validate($user);

        if (count($errors) > 0) {
            $properties = [];
            foreach ($errors as $error) {
                $property = $error->getPropertyPath();
                $constraint = $error->getConstraint();

                if ($constraint->payload) {
                    $properties[$property]['messages'][$constraint->payload] = $error->getMessage();
                } else {
                    $properties[$property]['messages'][] = $error->getMessage();
                }
            }
            return $this->json([
                'errors' => true,
                'properties' => $properties
            ]);
        }

        $password = $passwordEncoder->encodePassword($user, $user->getPassword());

        $user
            ->setPassword($password)
            ->setBill(0);

        $em = $this->getDoctrine()->getManager();
        $em->persist($user);
        $em->flush();

        return $this->json([
            'errors' => false
        ]);

    }

    /**
     * @Rest\Get("/currencies", name="currencies")
     */
    public function getCurrencies()
    {
        return $this->json(self::CURRENCY);
    }

}
