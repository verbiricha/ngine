"use client";

import { useState } from "react";
import {
  Stack,
  HStack,
  FormControl,
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
  Button,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import { Feed } from "@ngine/core";
import { FormattedMessage } from "react-intl";

import { kinds, components } from "../kinds";

export default function SearchFeed({ relays }: { relays: string[] }) {
  // todo: store search params in URL
  const [query, setQuery] = useState("");
  const [term, setTerm] = useState("");

  function search() {
    setQuery(term);
  }

  function clear() {
    setQuery("");
    setTerm("");
  }
  return (
    <Stack>
      <FormControl>
        <HStack>
          <InputGroup size="md">
            <Input
              pr="2.5em"
              value={term}
              onChange={(ev) => setTerm(ev.target.value)}
              placeholder="Search term"
            />
            <InputRightElement width="2.5rem">
              <IconButton
                aria-label="Clear"
                isDisabled={term.length === 0}
                icon={<CloseIcon />}
                variant="ghost"
                colorScheme="red"
                size="sm"
                onClick={clear}
              />
            </InputRightElement>
          </InputGroup>
          <Button
            aria-label="Search"
            isDisabled={term.length === 0}
            leftIcon={<SearchIcon />}
            variant="outline"
            colorScheme="brand"
            onClick={search}
          >
            <FormattedMessage
              id="relay-search"
              description="Relay search button"
              defaultMessage="Search"
            />
          </Button>
        </HStack>
      </FormControl>
      <Feed
        key={query}
        filter={
          query.trim().length === 0 ? { kinds } : { kinds, search: query }
        }
        relays={relays}
        pageSize={10}
        components={components}
      />
    </Stack>
  );
}
