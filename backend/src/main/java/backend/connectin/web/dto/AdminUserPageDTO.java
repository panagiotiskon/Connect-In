package backend.connectin.web.dto;

import java.util.List;

public record AdminUserPageDTO(List<UserDTO> content, int page, int size, boolean hasMore) {
}
