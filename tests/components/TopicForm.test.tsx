import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProtocolProvider } from '../../contexts/ProtocolContext';
import TopicForm from '../../components/TopicForm';

describe('TopicForm', () => {
  it('renderiza el formulario y permite escribir el tema', () => {
    render(
      <ProtocolProvider>
        <TopicForm />
      </ProtocolProvider>
    );

    const input = screen.getByPlaceholderText('Ej: Shock Séptico en paciente adulto');
    fireEvent.change(input, { target: { value: 'Infarto agudo de miocardio' } });

    expect(input).toHaveValue('Infarto agudo de miocardio');
    expect(screen.getByRole('button', { name: /generar con ia/i })).toBeInTheDocument();
  });
});
