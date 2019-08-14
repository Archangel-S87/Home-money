<?php

namespace App\Controller;

use App\Entity\Category;
use App\Entity\Event;
use App\Entity\User;
use App\Repository\CategoriesRepository;
use App\Repository\EventsRepository;
use App\Services\Shared;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use FOS\RestBundle\Controller\Annotations as Rest;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class SystemController extends AbstractController
{

    /**
     * @Rest\Get("/system/bill/edit", name="editBill")
     * @param Request $request
     * @param ValidatorInterface $validator
     * @return Response
     */
    public function editBill(Request $request, ValidatorInterface $validator)
    {
        $user = $this->getUser();
        $this->denyAccessUnlessGranted('view', $user);

        $user->setBill($request->get('bill'));

        $errors = $validator->validateProperty($user, 'bill');

        if (count($errors) > 0) {
            return $this->json(Shared::errorsHandler($errors));
        }

        $em = $this->getDoctrine()->getManager();
        $em->persist($user);
        $em->flush();

        return $this->json(Shared::response());
    }

    /**
     * TODO Убрать id из запроса
     * @Rest\Get("/system/bill/{id}", name="getBill", requirements={"id"="\d+"})
     * @param User $user
     * @return Response
     */
    public function getBill(User $user)
    {
        $this->denyAccessUnlessGranted('view', $user);

        return $this->json(Shared::response([
            'bill' => $user->getBill(),
            'currency' => $user->getCurrency()
        ]));
    }

    /**
     * @Rest\Get("/system/categories", name="getCategories")
     * @param CategoriesRepository $repository
     * @return Response
     */
    public function getCategories(CategoriesRepository $repository)
    {
        $user = $this->getUser();
        $this->denyAccessUnlessGranted('view', $user);

        $categories = $repository->findBy(['author' => $user->getId()]);
        $data = [];

        if ($categories) {
            foreach ($categories as $category) {
                $data[] = [
                    'id' => $category->getId(),
                    'name' => $category->getName(),
                    'capacity' => $category->getCapacity()
                ];
            }
        }

        return $this->json(Shared::response($data));
    }

    /**
     * @Rest\Get("/system/category/{id}", name="getCategoryById", requirements={"id"="\d+"})
     * @param Category $category
     * @return Response
     */
    public function getCategoryById(Category $category)
    {
        $user = $this->getUser();
        $this->denyAccessUnlessGranted('view', $user);

        $data = [];
        if ($category) {
            $data = [
                'id' => $category->getId(),
                'name' => $category->getName(),
                'capacity' => $category->getCapacity()
            ];
        }

        return $this->json(Shared::response($data));
    }

    /**
     * @Rest\Get("/system/category/edit/{id}", name="editCategory", requirements={"id"="\d+"})
     * @param Category $category
     * @param Request $request
     * @param ValidatorInterface $validator
     * @return Response
     */
    public function editCategory(Category $category, Request $request, ValidatorInterface $validator)
    {
        $user = $this->getUser();
        $this->denyAccessUnlessGranted('view', $user);

        if (!$category) $this->json(Shared::response([]));

        $category
            ->setName($request->get('name'))
            ->setCapacity($request->get('capacity'));

        $errors = $validator->validate($category);

        if (count($errors) > 0) {
            return $this->json(Shared::errorsHandler($errors));
        }

        $em = $this->getDoctrine()->getManager();
        $em->persist($category);
        $em->flush();

        return $this->json(Shared::response([
            'id' => $category->getId(),
            'name' => $category->getName(),
            'capacity' => $category->getCapacity()
        ]));
    }

    /**
     * @Rest\Get("/system/category/add", name="addCategory")
     * @param Request $request
     * @param ValidatorInterface $validator
     * @return Response
     */
    public function addCategories(Request $request, ValidatorInterface $validator)
    {
        $user = $this->getUser();
        $this->denyAccessUnlessGranted('view', $user);

        $category = new Category();
        $category
            ->setName($request->get('name'))
            ->setAuthor($user->getId())
            ->setCapacity($request->get('capacity'));

        $errors = $validator->validate($category);

        if (count($errors) > 0) {
            return $this->json(Shared::errorsHandler($errors));
        }

        $em = $this->getDoctrine()->getManager();
        $em->persist($category);
        $em->flush();

        return $this->json(Shared::response([
            'id' => $category->getId(),
            'name' => $category->getName(),
            'capacity' => $category->getCapacity(),
        ]));
    }

    /**
     * @Rest\Get("/system/events", name="getEvents")
     * @param EventsRepository $repository
     * @return Response
     * @throws \Exception
     */
    public function getEvents(EventsRepository $repository)
    {
        $user = $this->getUser();
        $this->denyAccessUnlessGranted('view', $user);

        $events = $repository->findEventsCurrentMonth($user);
        $data = [];

        if ($events) {
            foreach ($events as $event) {
                $data[] = [
                    'id' => $event->getId(),
                    'type' => $event->getType(),
                    'amount' => $event->getAmount(),
                    'category' => $event->getCategory(),
                    'date' => $event->getDate()->format('d.m.Y H:i:s'),
                    'description' => $event->getDescription()
                ];
            }
        }

        return $this->json(Shared::response($data));
    }

    /**
     * @Rest\Get("/system/event/add", name="addEvent")
     * @param Request $request
     * @param ValidatorInterface $validator
     * @return Response
     * @throws \Exception
     */
    public function addEvent(Request $request, ValidatorInterface $validator)
    {
        $user = $this->getUser();
        $this->denyAccessUnlessGranted('view', $user);

        $event = new Event();
        $event
            ->setAmount($request->get('amount'))
            ->setType($request->get('type'))
            ->setCategory($request->get('category'))
            ->setDate($request->get('date'))
            ->setDescription($request->get('description'))
            ->setAuthor($user->getId());

        $errors = $validator->validate($event);

        if (count($errors) > 0) {
            return $this->json(Shared::errorsHandler($errors));
        }

        $em = $this->getDoctrine()->getManager();
        $em->persist($event);
        $em->flush();

        return $this->json(Shared::response());
    }

    /**
     * @Rest\Get("/system/event/{id}", name="getEventById", requirements={"id"="\d+"})
     * @param Event $event
     * @return Response
     */
    public function getEventById(Event $event)
    {
        $user = $this->getUser();
        $this->denyAccessUnlessGranted('view', $user);

        $data = [];
        if ($event) {
            $data = [
                'id' => $event->getId(),
                'type' => $event->getType(),
                'amount' => $event->getAmount(),
                'category' => $event->getCategory(),
                'date' => $event->getDate()->format('d.m.Y H:i:s'),
                'description' => $event->getDescription()
            ];
        }

        return $this->json(Shared::response($data));
    }

}
