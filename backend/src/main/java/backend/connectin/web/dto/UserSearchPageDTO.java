package backend.connectin.web.dto;

import java.util.List;

public record UserSearchPageDTO(List<RegisteredUserDTO> content, int page, int size, boolean hasMore) {
}
