<?php

namespace App\Controller;

use App\Entity\Category;
use App\Entity\User;
use App\Repository\CategoriesRepository;
use App\Services\Shared;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use FOS\RestBundle\Controller\Annotations as Rest;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class SystemController extends AbstractController
{

    /**
     * TODO Убрать id из запроса
     * @Rest\Get("/system/bill/{id}", name="getBill")
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
        foreach ($categories as $category) {
            $data[] = [
                'id' => $category->getId(),
                'name' => $category->getName(),
                'capacity' => $category->getCapacity()
            ];
        }

        return $this->json(Shared::response($data));
    }

    /**
     * @Rest\Get("/system/category/edit/{id}", name="editCategory")
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



}
