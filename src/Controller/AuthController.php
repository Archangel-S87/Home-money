<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\Mapping\Entity;
use JMS\Serializer\Serializer;
use JMS\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use FOS\RestBundle\Controller\Annotations as Rest;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class AuthController extends AbstractController
{

    // Список валют личного счёта
    const CURRENCIES = ['RUB', 'BYN', 'USD'];
    
    /**
     * @var UserRepository
     */
    private $userRepository;
    /**
     * @var UserPasswordEncoderInterface
     */
    private $passwordEncoder;
    /**
     * @var ValidatorInterface
     */
    private $validator;
    /**
     * @var SerializerInterface
     */
    private $serializer;

    /**
     * Ответ клиенту
     */
    private $response;


    public function __construct(
        UserRepository $userRepository,
        ValidatorInterface $validator,
        UserPasswordEncoderInterface $passwordEncoder,
        SerializerInterface $serializer
    )
    {
        $this->userRepository = $userRepository;
        $this->passwordEncoder = $passwordEncoder;
        $this->validator = $validator;
        $this->serializer = $serializer;

        $this->response = [
            'errors' => true,
            'data' => []
        ];
    }

    /**
     * @Rest\Get("/login", name="login")
     * @param Request $request
     * @return JsonResponse
     */
    public function login(Request $request)
    {

        $email = $request->get('email');
        $pass = $request->get('password');

        if (!$email || !$pass) return $this->json($this->response);

        $user = $this->userRepository->findOneBy(['email' => $email]);

        if (!$user) {
            $this->response['data']['message'] = 'Такого пользователя не существует';
            return $this->json($this->response);
        }

        if (!$this->passwordEncoder->isPasswordValid($user, $pass)) {
            $this->response['data']['message'] = 'Неверный проль';
            return $this->json($this->response);
        }

        $token = sha1($email.rand(11111, 99999));

        $user->setApiToken($token);

        $em = $this->getDoctrine()->getManager();
        $em->persist($user);
        $em->flush();

        $this->response['errors'] = false;
        $this->response['data'] = [
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getBill(),
                'name' => $user->getUsername(),
                'token' => $user->getApiToken(),
                'bill' => $user->getBill(),
                'currency' => $user->getCurrency()
            ]
        ];

        return $this->json($this->response);

    }

    /**
     * @Rest\Get("/is-email", name="isEmail")
     * @param Request $request
     * @return JsonResponse
     */
    public function isEmail(Request $request)
    {

        $email = $request->get('email');

        $this->response['errors'] = false;
        $this->response['data']['is_email'] = !!$this->userRepository->findOneBy(['email' => $email]);

        return $this->json($this->response);

    }

    /**
     * @Rest\Get("/registration", name="registration")
     * @param Request $request
     * @return JsonResponse
     */
    public function registration(Request $request)
    {

        $user = new User();
        $user
            ->setEmail($request->get('email'))
            ->setPlainPassword($request->get('password'))
            ->setUsername($request->get('name'))
            ->setCurrency($request->get('currency'));

        $errors = $this->validator->validate($user);

        if (count($errors) > 0) {
            // Вот так можно запилить по накуе и проще
            //$rep = $this->serializer->serialize($errors, 'json');
            //return JsonResponse::fromJsonString($rep, 404);
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

            $this->response['data'] = $properties;
            return $this->json($this->response);
        }

        $password = $this->passwordEncoder->encodePassword($user, $user->getPlainPassword());

        $user
            ->setPassword($password)
            ->setBill(0);

        $em = $this->getDoctrine()->getManager();
        $em->persist($user);
        $em->flush();

        $this->response['errors'] = false;

        return $this->json($this->response);

    }

    /**
     * @Rest\Get("/currencies", name="currencies")
     */
    public function getCurrencies()
    {
        $this->response = [
            'errors' => false,
            'data' => [
                'currencies' => self::CURRENCIES
            ]
        ];
        return $this->json($this->response);
    }



}
