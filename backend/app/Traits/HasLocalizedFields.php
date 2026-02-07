<?php

namespace App\Traits;

trait HasLocalizedFields
{
    /**
     * Get a localized field value based on the current application locale.
     *
     * @param string $field The base field name (e.g., 'name', 'description')
     * @return string|null
     */
    protected function getLocalizedField(string $field): ?string
    {
        $locale = app()->getLocale();
        $suffix = $this->getLocaleSuffix($locale);
        
        return $this->{"{$field}_{$suffix}"} ?? $this->{"{$field}_eng"};
    }

    /**
     * Get the field suffix for the given locale.
     *
     * @param string $locale
     * @return string
     */
    private function getLocaleSuffix(string $locale): string
    {
        return match ($locale) {
            'en' => 'eng',
            'ru' => 'ru',
            'uz' => 'uz',
            default => 'eng',
        };
    }
}
