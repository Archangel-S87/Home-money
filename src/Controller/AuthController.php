<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Services\Shared;
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

        if (!$email || !$pass) return $this->json(Shared::errorsHandler());

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

        return $this->json(Shared::response([
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getBill(),
                'name' => $user->getUsername(),
                'token' => $user->getApiToken(),
                'bill' => $user->getBill(),
                'currency' => $user->getCurrency()
            ]
        ]));

    }

    /**
     * @Rest\Get("/is-email", name="isEmail")
     * @param Request $request
     * @return JsonResponse
     */
    public function isEmail(Request $request)
    {
        $email = $request->get('email');

        return $this->json(Shared::response([
            'is_email' => !!$this->userRepository->findOneBy(['email' => $email])
        ]));
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
            return $this->json(Shared::errorsHandler($errors));
        }

        $password = $this->passwordEncoder->encodePassword($user, $user->getPlainPassword());

        $user
            ->setPassword($password)
            ->setBill(0);

        $em = $this->getDoctrine()->getManager();
        $em->persist($user);
        $em->flush();

        return $this->json(Shared::response());
    }

    /**
     * @Rest\Get("/currencies", name="currencies")
     */
    public function getCurrencies()
    {
        return $this->json(Shared::response([
            'currencies' => self::CURRENCIES
        ]));
    }



}
