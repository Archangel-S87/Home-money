<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\EventsRepository")
 * @ORM\Table(name="events")
 */
class Event
{
    const INCOME = 'income';
    const OUTCOME = 'outcome';

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @Assert\NotBlank(message="Должен быть тип события")
     * @Assert\Choice(callback="extractType", message="Не верная значение")
     * @ORM\Column(type="string", length=10)
     */
    private $type;

    /**
     * @Assert\NotBlank(message="Должен быть сумма")
     * @Assert\Type(type="float", message="Суииа должна быть числом")
     * @ORM\Column(type="float")
     */
    private $amount;

    /**
     * @Assert\NotBlank(message="Должна быть категория")
     * @Assert\Type(type="integer", message="Категория должна быть числом")
     * @ORM\Column(type="integer")
     */
    private $category;

    /**
     * @Assert\NotBlank(message="Должен быть дата")
     * @Assert\Type(type="DateTime", message="Неверный тип даты")
     * @ORM\Column(type="date")
     */
    private $date;

    /**
     * @Assert\NotBlank(message="Должен быть описание")
     * @ORM\Column(type="string", length=255)
     */
    private $description;

    /**
     * Кто создал категорию
     * @Assert\NotBlank(message="Должен быть автор")
     * @Assert\Type(type="integer", message="Автор - id")
     * @ORM\Column(type="integer")
     */
    private $author;


    public function extractType(): array
    {
        return [self::INCOME, self::OUTCOME];
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount(?float $amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getCategory(): ?int
    {
        return $this->category;
    }

    public function setCategory(int $category): self
    {
        $this->category = $category;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    /**
     * @param $date
     * @return Event
     * @throws \Exception
     */
    public function setDate($date): self
    {
        $this->date = new \DateTime('@' . strtotime($date));;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getAuthor(): ?int
    {
        return $this->author;
    }

    public function setAuthor($author): self
    {
        $this->author = $author;

        return $this;
    }

}
