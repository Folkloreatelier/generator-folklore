#!/usr/bin/env php
<?php

require __DIR__.'/../../vendor/autoload.php';

$allowedClasses = [
    // Define specific class
];

$apiPath = __DIR__.'/../api';
$templatesPath = $apiPath.'/_templates';
$destinationPath = $apiPath;

$xml = simplexml_load_file($apiPath.'/structure.xml');

$loader = new Twig_Loader_Filesystem($templatesPath);
$twig = new Twig_Environment($loader);

function cleanDescription($text)
{
    $text = strip_tags((string)$text);
    $text = trim(preg_replace('/\s+/', ' ', $text));
    return $text;
}

function getMethodFromXml($method)
{
    $data = [
        'name' => (string)$method->name,
        'arguments' => [],
        'return' => null,
    ];
    if (!empty($method->docblock->description)) {
        $data['description'] = (string)$method->docblock->description;
    }
    if (!empty($method->docblock->{'long-description'})) {
        $lines = explode(PHP_EOL, (string)$method->docblock->{'long-description'});
        $descriptionLines = [];
        $exampleLines = [];
        $reachedExample = false;
        foreach ($lines as $line) {
            if (preg_match('/^Examples\s*\:$/', trim($line))) {
                $reachedExample = true;
                continue;
            }
            if ($reachedExample) {
                $exampleLines[] = $line;
            } else {
                $descriptionLines[] = $line;
            }
        }
        if (sizeof($descriptionLines)) {
            $data['description'] .= PHP_EOL.PHP_EOL.implode(PHP_EOL, $descriptionLines);
        }
        if (sizeof($exampleLines)) {
            $data['examples'] = implode(PHP_EOL, $exampleLines);
        }
    }

    $arguments = [];
    foreach ($method->argument as $argument) {
        $name = (string)$argument->name;
        $type = (string)$argument->type;
        $argumentData = [
            'name' => $name,
            'type' => $type,
        ];
        if (!empty($argument->default)) {
            $argumentData['default'] = (string)$argument->default;
        }
        foreach ($method->docblock->tag as $tag) {
            $tagName = (string)$tag['name'];
            $tagVariable = (string)$tag['variable'];
            if ($tagName !== 'param' || $tagVariable !== $name) {
                continue;
            }
            $argumentData['description'] = cleanDescription($tag['description']);
        }
        $arguments[] = $argumentData;
    }
    $data['arguments'] = $arguments;

    foreach ($method->docblock->tag as $tag) {
        $name = (string)$tag['name'];
        if ($name !== 'return') {
            continue;
        }
        $data['return'] = [
            'type' => (string)$tag->type,
            'description' => cleanDescription($tag['description']),
        ];
    }

    return $data;
}

function getClassFromXml($class)
{
    $data = [
        'name' => (string)$class->name,
        'methods' => [],
    ];
    if (!empty($class->description)) {
        $data['description'] = (string)$class->description;
    }
    if (!empty($class->extends)) {
        $data['extends'] = (string)$class->extends;
    }

    $methods = [];
    foreach ($class->method as $method) {
        $name = (string)$method->name;
        $visibility = (string)$method['visibility'];
        if ($visibility !== 'public' || substr($name, 0, 2) === '__') {
            continue;
        }
        $methods[] = getMethodFromXml($method);
    }
    $data['methods'] = $methods;

    return $data;
}

foreach ($xml->file as $file) {
    if (sizeof($file->class) !== 1 || (string)$file->class['namespace'] !== 'Folklore\Image') {
        continue;
    }

    $class = getClassFromXml($file->class);
    if (!in_array($class['name'], $allowedClasses)) {
        continue;
    }

    $filename = snake_case($class['name'], '-').'.md';
    $destination = $destinationPath.'/'.$filename;
    $templateFilename = $filename.'.twig';
    $templatePath = file_exists($templatesPath.'/'.$templateFilename) ? $templateFilename : 'class.md.twig';
    $content = $twig->render($templatePath, [
        'class' => $class,
    ]);

    file_put_contents($destination, $content);
}
