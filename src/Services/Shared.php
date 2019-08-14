<?php


namespace App\Services;


class Shared
{

    static $response = [
        'errors' => false,
        'data' => []
    ];

    public static function errorsHandler($errors = []) {

        $response = self::$response;
        $response['errors'] = true;

        if ($errors) {
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
            $response['data'] = $properties;
        }

        return $response;

    }

    public static function response($data = []) {
        $response = self::$response;
        $response['data'] = $data;
        return $response;
    }

}
