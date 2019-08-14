<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\CategoriesRepository")
 * @ORM\Table(name="categories")
 * @UniqueEntity(fields={"name", "author"}, message="Не уникальный название", payload="forbiddenName")
 */
class Category
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @Assert\NotBlank(message="Название не может быть пустым")
     * @Assert\Length(min=2, minMessage="Название не может быть менее {{ limit }} символов")
     * @ORM\Column(type="string", length=255)
     */
    private $name;

    /**
     * Ограничение расходов за периуд
     * @Assert\Type(type="integer", message="Лимит должен быть числом")
     * @ORM\Column(type="integer", nullable=true)
     */
    private $capacity;

    /**
     * @Assert\NotBlank(message="Должен быть автор")
     * Кто создал категорию
     * @ORM\Column(type="integer")
     */
    private $author;


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getCapacity(): ?int
    {
        return $this->capacity;
    }

    public function setCapacity(?int $capacity): self
    {
        $this->capacity = $capacity;

        return $this;
    }

    public function getAuthor(): ?int
    {
        return $this->author;
    }

    public function setAuthor(int $author): self
    {
        $this->author = $author;

        return $this;
    }

}
