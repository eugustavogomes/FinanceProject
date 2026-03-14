import { useState, useCallback } from 'react';

export interface ConfirmDeleteTarget<T = string | number> {
  id: T;
  name?: string;
  label?: string;
}

export interface UseConfirmDeleteOptions<T = string | number> {
  onConfirm: (id: T) => Promise<void> | void;
  formatMessage?: (target: ConfirmDeleteTarget<T>) => string;
}

export interface UseConfirmDeleteReturn<T = string | number> {
  isOpen: boolean;
  target: ConfirmDeleteTarget<T> | null;
  loading: boolean;
  open: (id: T, nameOrLabel?: string) => void;
  confirm: () => Promise<void>;
  cancel: () => void;
  message: string;
}

/**
 * Encapsulates confirmation delete modal state and handlers.
 * Use with ConfirmationModal for consistent delete UX across list pages.
 */
export function useConfirmDelete<T extends string | number = string>(
  options: UseConfirmDeleteOptions<T>
): UseConfirmDeleteReturn<T> {
  const { onConfirm, formatMessage } = options;
  const [isOpen, setIsOpen] = useState(false);
  const [target, setTarget] = useState<ConfirmDeleteTarget<T> | null>(null);
  const [loading, setLoading] = useState(false);

  const open = useCallback((id: T, nameOrLabel?: string) => {
    setTarget({ id, name: nameOrLabel, label: nameOrLabel } as ConfirmDeleteTarget<T>);
    setIsOpen(true);
  }, []);

  const cancel = useCallback(() => {
    setIsOpen(false);
    setTarget(null);
  }, []);

  const confirm = useCallback(async () => {
    if (!target) return;
    setLoading(true);
    try {
      await onConfirm(target.id);
    } finally {
      setLoading(false);
      cancel();
    }
  }, [target, onConfirm, cancel]);

  const message =
    target && formatMessage
      ? formatMessage(target)
      : target?.name ?? target?.label
        ? `Are you sure you want to delete "${target.name ?? target.label}"? This action cannot be undone.`
        : 'Are you sure?';

  return { isOpen, target, loading, open, confirm, cancel, message };
}
