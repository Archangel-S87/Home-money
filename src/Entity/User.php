<?php

namespace App\Entity;

use App\Controller\AuthController;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 * @ORM\Table(name="users")
 * @UniqueEntity(fields={"email", "apiToken"}, message="Не уникальный email", payload="forbiddenEmail")
 */
class User implements UserInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @Assert\NotBlank(message="email не может быть пустым")
     * @Assert\Length(min=3, minMessage="email не может быть менее {{ limit }} символов")
     * @Assert\Email(message = "Введите коректный email")
     * @ORM\Column(type="string", length=180, unique=true)
     */
    private $email;

    /**
     * @ORM\Column(type="json")
     */
    private $roles = [];

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     */
    private $password;

    /**
     * @Assert\NotBlank(message="Пароль не может быть пустым")
     * @Assert\Length(min=6, minMessage="Пароль не может быть менее {{ limit }} символов")
     */
    private $plainPassword;

    /**
     * @ORM\Column(type="string", nullable=true, unique=true)
     */
    private $apiToken;

    /**
     * @Assert\NotBlank(message="Имя не может быть пустым")
     * @Assert\Length(min=3, minMessage="Имя не может быть менее {{ limit }} символов")
     * @ORM\Column(type="string", length=255)
     */
    private $name;

    /**
     * @ORM\Column(type="float")
     */
    private $bill;

    /**
     * @Assert\Choice(callback="getCurrencies", message="Не верная валюта")
     * @ORM\Column(type="string", length=3)
     */
    private $currency;

    /**
     * @return null | integer
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @param string $email
     * @return self
     */
    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * @return string
     */
    public function getEmail(): ?string
    {
        return $this->email;
    }

    /**
     * @param string $name
     * @return self
     */
    public function setUsername(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string)$this->name;
    }

    /**
     * @param mixed $bill
     * @return self
     */
    public function setBill($bill): self
    {
        $this->bill = $bill;

        return $this;
    }

    /**
     * @return float
     */
    public function getBill(): ?float
    {
        return $this->bill;
    }

    /**
     * @param mixed $currency
     * @return self
     */
    public function setCurrency($currency): self
    {
        $this->currency = $currency;

        return $this;
    }

    /**
     * @return string
     */
    public function getCurrency(): string
    {
        return $this->currency;
    }

    /**
     * @return array
     */
    public function getCurrencies(): array
    {
        return AuthController::CURRENCIES;
    }

    /**
     * @param string $plainPassword
     * @return self
     */
    public function setPlainPassword(string $plainPassword): self
    {
        $this->plainPassword = $plainPassword;

        return $this;
    }

    /**
     * @return string
     */
    public function getPlainPassword(): string
    {
        return $this->plainPassword;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return (string)$this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @return string
     */
    public function getApiToken(): string
    {
        return $this->apiToken;
    }

    /**
     * @param mixed $apiToken
     * @return self
     */
    public function setApiToken($apiToken): self
    {
        $this->apiToken = $apiToken;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getSalt()
    {
        // not needed when using the "bcrypt" algorithm in security.yaml
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        $this->plainPassword = null;
    }

}
